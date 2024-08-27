import { VirtualEstateLevel } from "@src/features/virtual-estate/interface/virtual-estate.interface";

import Typography from "@mui/joy/Typography";

interface Props {
  level?: VirtualEstateLevel;
}

export default function VirtualEstateLevelChip({ level }: Props) {
  switch (level) {
    case "GENESIS":
      return (
        <div className="inline-block px-4 py-1 bg-purple-700 rounded-full">
          <Typography className="!text-yellow-400" level="title-sm">
            创世
          </Typography>
        </div>
      );
  }

  return (
    <div>
      <Typography>{level}</Typography>
    </div>
  );
}
