import * as React from "react";

type SVGComponentProps = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties & {
    enableBackground?: string;
  };
};

const Diamond: React.FC<SVGComponentProps> = (props) => (
  <img src="diamond.png" height={60} width={60} />
);
export default Diamond;
