"use client";

import { useState, useEffect } from "react";
import { axiosInstance as axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { cloudinaryLoader } from "@/lib/cloudinary";
import Header from "@/app/_components/header";
import Image from "next/image";
import dayjs from "dayjs";
import type { EventType } from "@/types/other";

const EventPage = ({ params }: { params: { eventId: string } }) => {
  const { status, user } = useUser();
  const [event, setEvent] = useState<EventType>();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  // TODO: implement cancel logic for buttons

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${params.eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [user, params.eventId]);

  const handleRegister = async () => {
    if (status === "unauthenticated" || !user || !event || isRegistered) return;

    try {
      const response = await axios.post(
        `/register/`,
        {
          event_id: event.id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      if (response.data.status === "success") {
        setCode(response.data.data);
        setIsRegistered(true);
      } else {
        setCode("");
        setIsRegistered(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    if (!user) return;

    try {
      const response = await axios.post(
        "/cancel/",
        {
          reservation_code: code,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      if (response.data.status === "success") {
        setIsRegistered(false);
        setCode("");
      }
    } catch (err) {}
  };

  if (loading) return <p>Loading event details...</p>;
  if (!event) return <p>No event</p>;

  return (
    <div className="h-full w-full">
      <Header />
      <div className="flex bg-gray-100 rounded-2xl mx-20 items-center sm:flex-row gap-12 mt-12 justify-center p-8 py-20">
        <div className="flex justify-center">
          <Image
            src={cloudinaryLoader({ src: event.thumbnail, width: 1400 })}
            width={600}
            height={400}
            alt={event.title}
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col w-1/2 ">
          <div>
            <h2 className="text-5xl">{event.title}</h2>
            {isRegistered && code ? <p>{code}</p> : <></>}
          </div>

          <p>
            Location: <strong>{event.location}</strong>
          </p>
          <p>
            Organizer: <strong>{event.organizer}</strong>
          </p>
          <p>
            Starts:{" "}
            <strong>
              {dayjs(event.start_date).format("ddd, D MMM - HH:mm")}
            </strong>
          </p>
          <p>
            Ends:{" "}
            <strong>
              {dayjs(event.end_date).format("ddd, D MMM - HH:mm")}
            </strong>
          </p>
          <button
            onClick={isRegistered ? handleCancel : handleRegister}
            className="mt-20 w-48 btn"
          >
            {isRegistered ? "Cancel" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
