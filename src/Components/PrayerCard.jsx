import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function PrayerCard({ name, time }) {
  return (
    <Card sx={{ width: "270px" }}>
      <CardContent>
        <Typography gutterBottom variant="h4" >
            {name}
        </Typography>
        <Typography variant="h3" sx={{ color: "black" }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  )
}
