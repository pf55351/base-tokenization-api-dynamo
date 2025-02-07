const TOKEN_MESSAGES = {
  FILE_TOKENIZE_FILE_NAME_BELOW_MIN_LENGTH:
    'Tokenization name below the minimun length of 3 characters.',
  FILE_TOKENIZE_FILE_NAME_EXCEEDS_MAX_LENGTH:
    'Tokenization name exceeds the maximum length of 35 characters.',
  FILE_TOKENIZE_FILE_ALREADY_EXISTS:
    'A tokenization with the same name already exists in the user namespace.',
  FILE_TOKENIZE_FILE_DESCRIPTION_EXCEEDS_MAX_LENGTH:
    'Tokenization description exceeds the maximum length of 100 characters.',
  FILE_TOKENIZE_FOLDER_NOT_FOUND: "The requested user folder doesn't exist.",
  FILE_TOKENIZE_INVALID_MIMETYPE: 'Invalid mimetype.',
  FILE_TOKENIZE_SHA256_ALREADY_EXISTS: 'A file with the same SHA-256 digest already exists.',
  FILE_TOKENIZE_SUCCESS: 'File successfully tokenized.',
  FILE_SIZE_EXCEEDS_MAX_SIZE: 'File exceeds the maximum size of 200M',
  FILE_FAILED_TO_UPLOAD_ON_S3: 'File failed to upload on S3',
  METADATA_FAILED_TO_UPLOAD: 'Metadata failed to upload on IPFS',
  FILES_SUCCESS: 'Files successfully retrieved.',
  FILE_SUCCESS: 'File successfully retrieved.',
  FILE_VERIFY_FILE_NOT_FOUND: 'No asset found with the specified SHA-256 hash.',
  FILE_VERIFY_SUCCESS: 'Asset successfully verified.',
  FILE_UUID_NOT_FOUND: 'File uuid not found.',
  TOKEN_NOT_FOUND: 'File not found.',
  FILE_NOT_IN_STORAGE: 'File not saved on S3.',
  FILE_FAILED_TO_STORE_ON_DB: 'File failed to store on databse',
};

export { TOKEN_MESSAGES };
