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
        height: '24px',
        objectFit: 'cover',
        transform: 'translateX(8px)',
      }}
      draggable={false}
    ></video>
  );
};
