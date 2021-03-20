import React, { ChangeEventHandler, useState } from 'react';
import loadImage from 'blueimp-load-image';

interface Props {
  disabled?: boolean;
  onChange?: (blob: Blob | null) => void;
}

export const ImageUploader = ({ disabled, onChange }: Props) => {
  const [upload, setUpload] = useState<Blob | null>(null);

  const onFileChangeHandler: ChangeEventHandler<HTMLInputElement> = (event): void => {
    const target = event.target;
    const key = event.target.name;
    const value = target.files && target.files[0];
    if (key && value && value.type.startsWith('image/')) {
      loadImage(
        value,
        (canvas) => (canvas as HTMLCanvasElement).toBlob((blob) => {
          setUpload(blob);
          if(onChange) {
            onChange(blob);
          }
        }, 'image/jpeg', 0.75),
        { maxWidth: 2048, maxHeight: 2048, orientation: true, canvas: true, noRevoke: true }
      );
    }
  };

  return (
    <label className="img-window upload">
      <input
        hidden
        type="file"
        name="upload"
        placeholder="上傳照片"
        accept="image/*"
        onChange={onFileChangeHandler}
        disabled={disabled}
      />
      {upload && <img src={URL.createObjectURL(upload)} alt="upload preview" />}
      {!upload && <span className="upload-field">請上傳圖片</span>}
    </label>
  );
};
