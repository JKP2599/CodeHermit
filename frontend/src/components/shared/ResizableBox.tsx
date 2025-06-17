import { ReactNode, useState } from 'react';
import { Box, BoxProps } from '@mui/material';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface ResizableBoxProps extends BoxProps {
  children: ReactNode;
  initialHeight: number;
  minHeight: number;
  maxHeight?: number;
}

export const ResizableBox = ({
  children,
  initialHeight,
  minHeight,
  maxHeight,
  ...props
}: ResizableBoxProps) => {
  const [height, setHeight] = useState(initialHeight);

  const onResize = (_: any, { size }: { size: { height: number } }) => {
    setHeight(size.height);
  };

  return (
    <Resizable
      height={height}
      width={Infinity}
      onResize={onResize}
      minConstraints={[Infinity, minHeight]}
      maxConstraints={[Infinity, maxHeight || Infinity]}
      axis="y"
      resizeHandles={['s']}
    >
      <Box
        {...props}
        sx={{
          height: `${height}px`,
          position: 'relative',
          ...props.sx,
        }}
      >
        {children}
      </Box>
    </Resizable>
  );
}; 