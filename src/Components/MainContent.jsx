import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import PrayerCard from "./PrayerCard";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/ar";
import moment from "moment";

dayjs.extend(localizedFormat);

export default function MainContent() {
  const [Timing, setTiming] = useState({
    Fajr: "00:00:00",
    Dhuhr: "00:00:00",
    Asr: "00:00:00",
    Maghrib: "00:00:00",
    Isha: "00:00:00",
  });

  const [selectedCity, setSelectedCity] = useState({
    name: "القاهره",
    apiName: "Cairo",
  });

  const [nextPrayerIndex, setNextPrayerIndex] = useState(1);

  const [remainingTime, setRemainingTime] = useState("00:00:00");

  const availableCities = [
    {
      name: "القاهره",
      apiName: "Cairo",
    },
    {
      name: "الاسكندريه",
      apiName: "Alexandria",
    },
    {
      name: "المنصوره",
      apiName: "Mansoura",
    },
  ];

  const prayersArry = [
    {
      name: "الفجر",
      key: "Fajr",
    },
    {
      name: "الظهر",
      key: "Dhuhr",
    },
    {
      name: "العصر",
      key: "Asr",
    },
    {
      name: "المغرب",
      key: "Maghrib",
    },
    {
      name: "العشا",
      key: "Isha",
    },
  ];

  async function fetchPrayerTimes() {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selectedCity.apiName}`
    );
    const timings = response.data.data.timings;
    setTiming(timings);
  }

  function hundleCityChange(event) {
    const selectedCity = availableCities.find(
      (city) => city.apiName === event.target.value
    );
    setSelectedCity(selectedCity);
    fetchPrayerTimes();
  }

  function countDownRemaining() {
    const timeNow = moment();
    let prayerIndex = 0;

    // Determine the next prayer based on the current time
    if (
      timeNow.isBefore(moment(Timing.Dhuhr, "HH:mm:ss")) &&
      timeNow.isAfter(moment(Timing.Fajr, "HH:mm:ss"))
    ) {
      prayerIndex = 1;
    } else if (
      timeNow.isBefore(moment(Timing.Asr, "HH:mm:ss")) &&
      timeNow.isAfter(moment(Timing.Dhuhr, "HH:mm:ss"))
    ) {
      prayerIndex = 2;
    } else if (
      timeNow.isBefore(moment(Timing.Maghrib, "HH:mm:ss")) &&
      timeNow.isAfter(moment(Timing.Asr, "HH:mm:ss"))
    ) {
      prayerIndex = 3;
    } else if (
      timeNow.isBefore(moment(Timing.Isha, "HH:mm:ss")) &&
      timeNow.isAfter(moment(Timing.Maghrib, "HH:mm:ss"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0; // Next prayer is Fajr after midnight
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObj = prayersArry[prayerIndex];
    let nextPrayerTimeMoment = moment(Timing[nextPrayerObj.key], "HH:mm:ss");

    // If the next prayer is Fajr and it is past midnight, add a day to ensure correct countdown
    if (prayerIndex === 0 && timeNow.isAfter(nextPrayerTimeMoment)) {
      nextPrayerTimeMoment = nextPrayerTimeMoment.add(1, "day");
    }

    const remainingTime = moment.duration(nextPrayerTimeMoment.diff(timeNow));

    setRemainingTime(
      `${String(remainingTime.hours()).padStart(2, "0")}:${String(
        remainingTime.minutes()
      ).padStart(2, "0")}:${String(remainingTime.seconds()).padStart(2, "0")}`
    );
  }

  useEffect(() => {
    fetchPrayerTimes();
    dayjs.locale("ar");
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      countDownRemaining();
    }, 1000);
    return () => clearInterval(interval);
  }, [Timing]);

  const time = dayjs().format("MMM D YYYY | h:mm");

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={6}>
          <h2>{time}</h2>
          <h1>{selectedCity.name}</h1>
        </Grid>
        <Grid size={6}>
          <h2>متبقي علي صلاه {prayersArry[nextPrayerIndex].name}</h2>
          <h1>{remainingTime}</h1>
        </Grid>
      </Grid>
      <Divider style={{ borderColor: "white", opacity: "0.1" }} />
      <Stack direction="row" justifyContent={"space-around"} style={{ marginTop: "50px" }}>
  <PrayerCard name={"الفجر"} time={ dayjs(`2023-01-01 ${Timing.Fajr}`).format("hh:mm A")} />
  <PrayerCard name={"الظهر"} time={dayjs(`2023-01-01 ${Timing.Dhuhr}`).format("hh:mm A")} />
  <PrayerCard name={"العصر"} time={dayjs(`2023-01-01 ${Timing.Asr}`).format("hh:mm A")} />
  <PrayerCard name={"المغرب"} time={dayjs(`2023-01-01 ${Timing.Maghrib}`).format("hh:mm A")} />
  <PrayerCard name={"العشا"} time={dayjs(`2023-01-01 ${Timing.Isha}`).format("hh:mm A")} />
</Stack>
      <Stack
        direction="row"
        justifyContent={"center"}
        style={{
          marginTop: "50px",
        }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">المدينه</InputLabel>
          <Select
            style={{
              color: "white",
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity.apiName}
            onChange={hundleCityChange}
            label="Age"
          >
            {availableCities.map((city) => (
              <MenuItem value={city.apiName} key={city.apiName}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
