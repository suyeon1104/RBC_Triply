import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="create-top">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <h2>{title}</h2>
    </div>
  );
};

export default PageHeader;
