"use client";

import { appName } from "@/constants";
import { phoneNumberWithoutFormatting } from "@/utils";
import React from "react";

const ChatOnWhatsappFixed = () => {
  return (
    <a
      href={`https://wa.me/${phoneNumberWithoutFormatting}?text=${encodeURIComponent(
        `Hello, I'm interested in making an offer for a car `
      )}`}
      target="_blank"
    >
      <div className="fixed bottom-6 right-24 flex items-center bg-gray-100 rounded-full shadow-md pr-4 pl-2 py-2 border-2 border-primary-blue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary-blue mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" />
          <path d="M20.52 3.449C12.831-3.984.106 1.407.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c9.756 0 15.349-7.946 15.349-15.445.001-4.13-1.599-8.01-4.5-10.93l.02.029zm-4.862 22.531h-.005c-2.646-.001-5.247-.667-7.533-1.924l-.534-.3-5.582 1.451 1.485-5.385-.345-.552c-1.395-2.223-2.13-4.786-2.129-7.379.004-7.661 6.266-13.899 13.949-13.899 3.716.001 7.213 1.45 9.832 4.075 2.612 2.631 4.049 6.119 4.048 9.837-.004 7.666-6.266 13.906-13.956 13.906l.02-.03z" />
        </svg>
        <span className="text-gray-900 text-sm font-semibold">
          Chat {appName}.com
        </span>
      </div>
    </a>
  );
};

export default ChatOnWhatsappFixed;
