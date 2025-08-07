import "./fileCards.css"

import pdfIcon from "../../../assets/images/fileCards/pdf-icon.svg";
import imageIcon from "../../../assets/images/fileCards/image-icon.svg"
import videoIcon from "../../../assets/images/fileCards/video-icon.svg"
import extractNameAfterLastDash from "../../../utils/urlExtraction";


interface fileCardsProps {
  fileName: string;
}

export default function FileCards({ fileName }: fileCardsProps) {
  const getFileIcon = (filename: string): any => {
    const lower = filename.toLowerCase();
    if (lower.match(/\.(pdf)$/)) return pdfIcon;
    if (lower.match(/\.(jpe?g|png|gif|webp|svg)$/)) return imageIcon;
    if (lower.match(/\.(mp4|mov|avi)$/)) return videoIcon;
  };

  const icon = getFileIcon(fileName);

  return (
    <a href={fileName} target="_blank" rel="noopener noreferrer" className="fileCard-link">
    <div className="fileCard">
      <div className="fileCard-content">
        <img src={icon} alt="file icon" className="file-icon" />
        <div className="fileCard-content-text">{extractNameAfterLastDash(fileName)}</div>
      </div>
    </div>
    </a>
  );
}
