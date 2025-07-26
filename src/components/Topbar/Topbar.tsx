import { useIsMobile } from '../../utils/useIsMobile';
import { DesktopTopbar } from './DesktopTopbar';
import { MobileTopbar } from './MobileTopbar';

export const Topbar = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileTopbar /> : <DesktopTopbar />;
};
