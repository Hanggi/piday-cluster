import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import Image from "next/image";

import React from "react";

const About = () => {
  return (
    <div className="container px-4 sm:px-20 lg:px-40 mb-40">
      <Card className="mt-8" size="md">
        <div className=" min-h-screen py-10">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="mb-10">
              <Typography
                className="text-center !mb-4 text-5xl font-extrabold !text-[rgba(89,59,139,100)] "
                level="h1"
              >
                PiDay World Metaverse
              </Typography>
              <Typography className="text-lg text-gray-700">
                PiDay World Metaverse is an Earth-mirrored metaverse land
                platform, with each hexagonal land corresponding to a real area
                of 314 square meters. Any pioneer can mint and trade land in
                PiDay Metaverse, and each piece of land is an NFT. Every pioneer
                can become a manager of a city, and PiDay Metaverse will adopt a
                DAO governance model, enabling virtual city autonomy and urban
                economic dividends in the metaverse. Everyone is a creator,
                manager, and beneficiary. Piday World Metaverse is the first
                metaverse land application platform in the Pinetwork ecosystem.
              </Typography>
            </div>

            <div className="flex justify-center mb-10">
              <Image
                alt="Landscape"
                className="rounded-lg shadow-lg"
                height={400}
                src="/img/about/banner.png"
                width={800}
              />
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                What Can Be Achieved in PiDay World?
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>
                  <strong>Own Land:</strong> Become a metaverse landlord.
                </li>
                <li>
                  <strong>Integral Mining:</strong> Become a metaverse miner.
                </li>
                <li>
                  <strong>Participate in DAO:</strong> Become a metaverse mayor.
                </li>
              </ul>
              <p className="mt-6 text-lg text-gray-700">
                We want to create a better world, where anyone can participate
                in management! In PiDay World, you can become anyone you want to
                be. Happy PiDay, Happy World!
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                PiDay World’s Three Major Sections:
              </h2>
              <div className="grid gap-10 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    Land Section
                  </h3>
                  <p className="text-lg text-gray-700">
                    Use PiCoin to mint and trade land, earning rewards from land
                    minting fees and trading fees.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    Points Section
                  </h3>
                  <p className="text-lg text-gray-700">
                    Earn platform points PiDayPoint (PP) through sign-ins,
                    invites, and land ownership.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    DAO Section
                  </h3>
                  <p className="text-lg text-gray-700">
                    City’s autonomous DAO and United Nations DAO for joint world
                    creation.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                Login Methods:
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>
                  Access through the Pi Browser App using Pi account
                  authorization.
                </li>
                <li>
                  Access via any browser using email registration and login.
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                PiDay Wallet Address:
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>Bind your testnet or mainnet wallet address.</li>
                <li>
                  Use the bound address to transfer PiCoins to the
                  platform&apos;s mainnet address. Funds will recharge
                  automatically in 30 seconds.
                </li>
                <li>Each Pi wallet address can bind only one account.</li>
              </ul>
            </div>

            <div className="flex justify-center mb-10">
              <Image
                alt="City Map"
                className="rounded-lg shadow-lg"
                height={400}
                src="/img/about/map.png"
                width={800}
              />
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                Official Social Media:
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>
                  <a
                    className="text-blue-500 hover:underline"
                    href="https://twitter.com/pidayapp"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    className="text-blue-500 hover:underline"
                    href="https://t.me/pidayapp"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    className="text-blue-500 hover:underline"
                    href="https://piday.world"
                  >
                    Official Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default About;
