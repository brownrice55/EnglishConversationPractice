import Nav from "react-bootstrap/Nav";
import Header from "../components/Header";

export default function Practice() {
  return (
    <>
      <Header
        title="練習"
        description="練習のページです"
        keywords="英語,英会話"
      />
      <Nav fill variant="tabs" defaultActiveKey="/" className="mt-3">
        <Nav.Item>
          <Nav.Link href="/">ランダム</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">もう一度</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">リスト</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}
