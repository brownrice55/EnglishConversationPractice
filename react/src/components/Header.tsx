import { Helmet } from "react-helmet-async";
import Breadcrumb from "react-bootstrap/Breadcrumb";

type HeaderProps = {
  title: string;
  description: string;
  keywords: string;
};

export default function Header({ title, description, keywords }: HeaderProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h1 className="lead py-2">{title}</h1>
    </>
  );
}
