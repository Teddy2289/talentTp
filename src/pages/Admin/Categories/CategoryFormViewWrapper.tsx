// views/admin/CategoryFormViewWrapper.tsx
import { useParams } from "react-router-dom";
import CategoryFormView from "../../../components/Ui/forms/CategoryFormView";

export default function CategoryFormViewWrapper() {
  const { id } = useParams<{ id: string }>();
  return <CategoryFormView categoryId={id ? parseInt(id, 10) : undefined} />;
}
