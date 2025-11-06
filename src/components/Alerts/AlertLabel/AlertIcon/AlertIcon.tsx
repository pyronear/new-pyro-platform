interface Props {
  iconPath: string;
}

export const AlertIcon = (props: Props) => {
  const { iconPath } = props;
  const src = `/src/assets/animations/${iconPath}.webm`;

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '20px',
        height: '20px',
        transform: 'translateX(8px) scale(1.75)',
        objectPosition: 'center',
        overflow: 'hidden',
      }}
      draggable={false}
    ></video>
  );
};
