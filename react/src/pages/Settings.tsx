import { useContext } from "react";
import Header from "../components/Header";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { settingsTitleArray } from "../config/titleData";
import { getListData } from "../utils/common";
import { DoesDataExistContext } from "../contexts/context";

export default function Settings() {
  const originalListData = getListData();
  const context = useContext(DoesDataExistContext);
  if (!context) {
    throw new Error("error");
  }
  const { doesDataExist } = context;

  return (
    <>
      <Header
        title="設定"
        description="設定のページです"
        keywords="英語,英会話"
      />
      <Row xs={1} md={2} className="g-4">
        {settingsTitleArray.map((val, index) => (
          <Col key={index}>
            {(val.link == "edit" && !doesDataExist) ||
            (val.link == "editList" && !originalListData.size) ||
            (val.link == "addList" && !doesDataExist) ? (
              ""
            ) : (
              <Link
                to={`/settings/${val.link}`}
                className="text-decoration-none"
              >
                <Card>
                  <Card.Body>
                    <Card.Title>{val.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            )}
          </Col>
        ))}
      </Row>
    </>
  );
}
