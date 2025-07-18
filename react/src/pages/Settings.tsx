import Header from "../components/Header";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

export default function Settings() {
  type DataType = {
    title: string;
    description: string;
    link: string;
  };
  const titleArray: DataType[] = [
    {
      title: "音声設定",
      description: "設定のページです",
      link: "audio",
    },
    {
      title: "カテゴリ名の設定",
      description: "設定のページです",
      link: "category",
    },
    {
      title: "リストの新規登録",
      description: "設定のページです",
      link: "addList",
    },
    {
      title: "リストの編集・削除",
      description: "設定のページです",
      link: "editList",
    },
  ];

  return (
    <>
      <Header
        title="設定"
        description="設定のページです"
        keywords="英語,英会話"
      />
      <Row xs={1} md={2} className="g-4">
        {titleArray.map((val, index) => (
          <Col key={index}>
            <Link to={`/settings/${val.link}`} className="text-decoration-none">
              <Card>
                <Card.Body>
                  <Card.Title>{val.title}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
}
