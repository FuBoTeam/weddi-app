import React, { useState } from 'react';

interface Props {
  imgUrls: string[];
  onChange?: (imgUrl: string) => void;
  disabled?: boolean;
}

export const ImagePicker = ({ imgUrls, onChange, disabled }: Props) => {
  const totalImages = imgUrls.length;
  const [pickerIndex, setPickerIndex] = useState(0);

  const renderPhotoRadios = () => imgUrls.map((url, i) => {
    const checked = pickerIndex === i;
    return (
      <React.Fragment key={url}>
        <input hidden type="radio" name="imgUrl" value={url} checked={checked} readOnly />
        <div className={`layer ${checked ? '' : ' hidden'}`} style={{ backgroundImage: `url(${url})` }} />
        <img className={`fade ${checked ? '' : ' hidden'}`} src={url} alt={url} />
      </React.Fragment>
    );
  });

  const plusImgIdx = (i: number): void => {
    const nextIdx = (pickerIndex + i + totalImages) % totalImages;

    setPickerIndex(nextIdx);
    if (onChange) {
      onChange(imgUrls[nextIdx]);
    }
  };

  return (
    <React.Fragment>
      <div className="img-window">
        <div className="numbertext">{pickerIndex + 1} / {totalImages}</div>
        {renderPhotoRadios()}
      </div>
      <span className="prev" onClick={() => !disabled && plusImgIdx(-1)}>&#10094;</span>
      <span className="next" onClick={() => !disabled && plusImgIdx(1)}>&#10095;</span>
    </React.Fragment>
  );
};
