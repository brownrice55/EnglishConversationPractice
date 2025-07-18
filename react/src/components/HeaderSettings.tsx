import Breadcrumb from "react-bootstrap/Breadcrumb";
import Header from "./Header";
import { getTitleData } from "../utils/common";

export default function HeaderSettings() {
  const titleData = getTitleData();
  return (
    <>
      <Header
        title={titleData.title}
        description={titleData.description}
        keywords="英語,英会話"
      />
      <Breadcrumb>
        <Breadcrumb.Item href="/settings">設定</Breadcrumb.Item>
        <Breadcrumb.Item active>{titleData.title}</Breadcrumb.Item>
      </Breadcrumb>
    </>
  );
}
