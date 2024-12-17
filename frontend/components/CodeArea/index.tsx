import { FC } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

type Prop = {
  code: string;
};

const code = `const foo = 'bar';`;

const style = {
  fontSize: "12px",
};

const CodeArea: FC<Prop> = ({ code }) => (
  <LiveProvider code={code}>
    <LiveEditor style={style} />
    <LivePreview style={style} />
    <LiveError style={style} />
  </LiveProvider>
);

export default CodeArea;
