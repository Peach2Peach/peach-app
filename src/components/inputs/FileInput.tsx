import { useState } from "react";
import { Platform } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { readFileInChunks } from "../../utils/file/readFileInChunks";
import { error } from "../../utils/log/error";
import { Input } from "./Input";
import { useTranslate } from "@tolgee/react";

type FileData = {
  name: string;
  content: string;
};

type Props = {
  fileName?: string;
  onChange?: (file: FileData) => void;
};

export const FileInput = ({ fileName, onChange }: Props) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslate("unassigned");
  const selectFile = async () => {
    setLoading(true);
    try {
      const file = await DocumentPicker.pickSingle();
      try {
        if (!file.uri) {
          throw Error("File could not be read");
        }

        const uri = Platform.select({
          android: file.uri,
          ios: decodeURIComponent(file.uri)?.replace?.("file://", ""),
        });

        if (!uri) throw new Error("No uri found");

        const content = await readFileInChunks(uri);
        setLoading(false);
        return {
          name: file.name || "",
          content,
        };
      } catch (e) {
        setLoading(false);
        error("File could not be read", e);
        return {
          name: "",
          content: "",
        };
      }
    } catch (err) {
      setLoading(false);
      return {
        name: "",
        content: "",
      };
    }
  };

  const onPress = async () => {
    if (loading || !onChange) return;
    onChange(await selectFile());
  };

  return (
    <Input
      value={fileName}
      onPressIn={onPress}
      icons={[["clipboard", onPress]]}
      disabled
      theme="inverted"
      placeholder={t("restoreBackup.decrypt.file")}
    />
  );
};
