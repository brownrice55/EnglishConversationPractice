import FormForAddAndEdit from "./FormForAddAndEdit";
import Header from "./Header";

export default function Add() {
  return (
    <>
      <Header
        title="新規登録"
        description="新規登録のページです"
        keywords="英語,英会話"
      />
      <FormForAddAndEdit keyNumber={0} isEditing={false} onUpdate={() => {}} />
    </>
  );
}
