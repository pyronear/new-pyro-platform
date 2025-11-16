import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

import { CamerasListSelectable } from '@/components/Common/Camera/CamerasListSelectable';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface SelectionCameraProps {
  sites: SiteType[];
  selectedSite: SiteType;
  selectedCamera: CameraFullInfosType | null;
  changeCamera: (newSite: SiteType, newCameraId: number | null) => void;
}

export const SelectionCameraWithoutAlert = ({
  sites,
  selectedSite,
  selectedCamera,
  changeCamera,
}: SelectionCameraProps) => {
  const { t } = useTranslationPrefix('live');

  const handleSiteChange = (event: SelectChangeEvent) => {
    const newSite = sites.find((s) => s.id == event.target.value) ?? null;
    if (newSite) {
      changeCamera(newSite, null);
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>{t('siteField')}</InputLabel>
        <Select
          value={selectedSite.id}
          label={t('siteField')}
          onChange={handleSiteChange}
          sx={{ boxShadow: 'none' }}
        >
          {sites.map((s) => (
            <MenuItem value={s.id} key={s.id}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        <CamerasListSelectable
          cameras={selectedSite.cameras}
          selectedCameraId={selectedCamera?.id ?? null}
          setSelectedCameraId={(newCameraId) =>
            changeCamera(selectedSite, newCameraId)
          }
        />
      </div>
    </>
  );
};
