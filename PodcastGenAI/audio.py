import os
import flask
import datetime
import re
import json
from google.cloud import storage, texttospeech
from pydub import AudioSegment

# Directory to store files (Cloud Run allows writing to /tmp)
FILE_DIR = '/tmp/'
BUCKET_NAME = 'aryan_bucket'

# Google TTS Client
client = texttospeech.TextToSpeechClient()

# Speaker-to-voice mapping
speaker_voice_map = {
    "Sascha": "en-US-Wavenet-D",
    "Marina": "en-US-Journey-O"
}

# Google TTS function
def synthesize_speech_google(text, speaker, index):
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name=speaker_voice_map[speaker]
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16
    )
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    filename = f"{FILE_DIR}{index}_{speaker}.wav"
    with open(filename, "wb") as out:
        out.write(response.audio_content)
    print(f'Audio content written to file "{filename}"')

def synthesize_speech(text, speaker, index):
    synthesize_speech_google(text, speaker, index)

# Function to sort filenames naturally
def natural_sort_key(filename):
    return [int(text) if text.isdigit() else text for text in re.split(r'(\d+)', filename)]

# Function to merge audio files
def merge_audios(audio_folder, output_file):
    combined = AudioSegment.empty()
    audio_files = sorted(
        [f for f in os.listdir(audio_folder) if f.endswith(".wav")],
        key=natural_sort_key
    )
    for filename in audio_files:
        audio_path = os.path.join(audio_folder, filename)
        print(f"Processing: {audio_path}")
        audio = AudioSegment.from_file(audio_path)
        combined += audio
    combined.export(output_file, format="mp3")
    print(f"Merged audio saved as {output_file}")

# Function to upload file to GCS
def upload_to_gcs(file_path, file_name):
    client = storage.Client()
    try:
        blob = client.bucket(BUCKET_NAME).blob(file_name)
        blob.upload_from_filename(file_path)
        print(f"File uploaded to GCS: {BUCKET_NAME}/{file_name}")
    except Exception as e:
        print(f"Error uploading to GCS: {e}")
        raise

# Function to generate the podcast audio from the provided conversation
def generate_audio(conversation, file_name_prefix):
    os.makedirs(FILE_DIR, exist_ok=True)
    for index, part in enumerate(conversation):
        speaker = part['speaker']
        text = part['text']
        synthesize_speech(text, speaker, index)

    audio_folder = FILE_DIR
    final_file_name = f"{file_name_prefix}_podcast.mp3"
    output_file_path = os.path.join(FILE_DIR, final_file_name)
    merge_audios(audio_folder, output_file_path)

    # Upload the final file to GCS
    try:
        upload_to_gcs(output_file_path, final_file_name)
        print(f"Final podcast uploaded successfully: {final_file_name}")
    except Exception as e:
        print(f"Error during final upload: {e}")
        raise

# Flask handler to accept the script through 'variable'
def hello_world(request):
    # Parse the JSON request body
    request_json = request.get_json(silent=True)

    # Extract the 'variable' parameter from the request body
    if request_json and 'variable' in request_json:
        try:
            # Parse the conversation script from the 'variable' field
            conversation = json.loads(request_json['variable'])
        except json.JSONDecodeError as e:
            return flask.make_response(f"Invalid input: 'variable' must be a valid JSON. Error: {e}", 400)
    else:
        return flask.make_response("Invalid input: Please provide a 'variable'.", 400)

    # Print the conversation to the console (Cloud Function logs)
    print(f"Received conversation script: {conversation}")

    # Create a unique file name based on the current timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name_prefix = f"podcast_{timestamp}"

    # Generate audio based on the provided conversation
    try:
        generate_audio(conversation, file_name_prefix)
    except Exception as e:
        return flask.make_response(f"Error during podcast generation: {e}", 500)

    response_message = f"Podcast generated and uploaded to GCS with prefix: {file_name_prefix}_podcast.mp3"
    return flask.make_response(response_message, 200)
