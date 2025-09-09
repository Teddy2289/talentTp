import { useParams } from "react-router-dom";
import ModelFormView from "../../../components/Ui/forms/ModelFormView";

export default function ModelFormViewWrapper() {
  const { id } = useParams<{ id: string }>();
  return <ModelFormView modelId={id ? parseInt(id, 10) : undefined} />;
}
