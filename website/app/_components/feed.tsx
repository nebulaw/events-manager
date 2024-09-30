import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "@/lib/axios";
import Image from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";
import dayjs from "dayjs";
import Link from "next/link";
import type { EventType } from "@/types/other";

const extractDate = (event: EventType) => {
  let startDate = event.start_date;
  let endDate = event.end_date;
  if (!endDate) {
    return dayjs(startDate).format("ddd, D MMM");
  } else {
    let sformatter = dayjs(startDate);
    let dformatter = dayjs(endDate);
    return sformatter.format("D MMM") + " - " + dformatter.format("D MMM");
  }
};

const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  const handleSearch = () => {
    fetchEvents();
  }

  const fetchEvents = () => {
    (async () => {
      try {
        const response = await axios.get(`/events/?search=${search}`);
        setEvents(response.data.results);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    })();
  }

  useEffect(() => fetchEvents, []);

  if (loading) {
    return <div className="flex w-full items-center justify-center h-full">Loading events...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
        <Link className="no-underline" href="/registered-events">See registered events</Link>
      </div>
      <div className="flex py-4 gap-2">
        <input onChange={handleChange} className="input-field" type="text" />
        <button onClick={handleSearch} className="btn">Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <Link
            href={`/event/${event.id}`}
            key={event.id}
            className="bg-white shadow-event rounded-lg overflow-hidden no-underline text-black"
          >
            <Image
              src={cloudinaryLoader({ src: event.thumbnail, width: 400 })}
              width={400}
              height={400}
              alt={event.title}
              className="h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600">{event.location}</p>
              <p className="font-bold">{extractDate(event)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventFeed;
