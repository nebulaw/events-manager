"use client";

import React, { useEffect, useState } from "react";
import { axiosInstance as axios } from "@/lib/axios";
import Image from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary";
import dayjs from "dayjs";
import Link from "next/link";
import type { EventType } from "@/types/other";
import Header from "../_components/header";
import { useUser } from "@/hooks/use-user";

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
  const { user } = useUser();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`/registered-events/`, {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${user.access_token}`
        },
        data: {
          "user_id": user?.user.id
        }
      });
      setEvents(response.data.results);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        Loading events...
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col py-8 items-center px-20">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-3xl font-bold mb-6">Registered Events</h2>
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
      </div>
    </div>
  );
};

export default EventFeed;
