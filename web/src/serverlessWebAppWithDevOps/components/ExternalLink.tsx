type Props = {
  href: string;
};

const ExternalLink: React.FC<Props> = ({ children, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default ExternalLink;
