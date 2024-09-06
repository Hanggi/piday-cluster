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
                level="h1"
                className="text-center !mb-4 text-5xl font-extrabold !text-[rgba(89,59,139,100)] "
              >
                PiDay World 派对世界
              </Typography>
              <Typography className="text-lg text-gray-700">
                PiDay是一个地球镜像元宇宙土地平台，每块六边形土地对应的实景面积是314平方米。任何先锋都可以在PiDay中铸造土地和交易土地，每一块土地都是一个NFT。每个先锋都可以成为城市的管理者，PiDay将采取DAO治理模式，开启元宇宙虚拟城市自治和城市经济分红，人人皆是创建者、人人皆是管理者、人人皆是受益者。PidayWorld是Pinetwork生态中第一个元宇宙土地应用平台。
              </Typography>
            </div>

            <div className="flex justify-center mb-10">
              <Image
                src="/img/about/banner.png"
                alt="Landscape"
                width={800}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                在派对世界能实现什么？
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>
                  <strong>拥有土地：</strong>成为一名元宇宙地主。
                </li>
                <li>
                  <strong>积分挖矿：</strong>成为一名元宇宙矿工。
                </li>
                <li>
                  <strong>参与DAO：</strong>成为一名元宇宙市长。
                </li>
              </ul>
              <p className="mt-6 text-lg text-gray-700">
                我们想创造一个更好的世界，一个任何人都可以参与管理的世界！在派对，你可以成为任何你想成为的人。Happy
                Piday，Happy World！
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界三大板块：
              </h2>
              <div className="grid gap-10 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    土地板块
                  </h3>
                  <p className="text-lg text-gray-700">
                    使用Picoin铸造和交易土地，邀请获得土地铸造费奖励。
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    积分板块
                  </h3>
                  <p className="text-lg text-gray-700">
                    签到、邀请、持有土地获得平台积分PidayPoint（PP）。
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                    DAO板块
                  </h3>
                  <p className="text-lg text-gray-700">
                    每个城市自治DAO和虚拟联合国DAO，共创世界。
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界登录方式：
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>在Pi浏览器APP内访问，使用Pi账号授权注册和登录。</li>
                <li>在任何浏览器访问，使用邮箱注册和登录。</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界钱包地址：
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>你可以绑定你的测试网钱包地址。</li>
                <li>你可以绑定你的主网映射钱包地址。</li>
                <li>
                  绑定映射地址后，使用你的映射地址向平台总地址转账，30秒后自动充值到派对钱包。
                </li>
              </ul>
              <p className="mt-6 text-lg text-gray-700">
                注意：每个Pi钱包地址只能绑定一个账号。
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界土地板块：
              </h2>
              <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                土地铸造
              </h3>
              <p className="text-lg text-gray-700">
                创世土地3万块，固定创世量，持有创世土地拥有城市创世居民权，参与城市自治管理和竞选，以及该城市二期土地销售分红和城市经济分红。
              </p>
              <p className="text-lg text-gray-700">铸造价格：</p>
              <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
                <li>1-10万块铸造价格为3.14派</li>
                <li>10-20万块铸造价格为6.28派</li>
                <li>20-3万块铸造价格为9.42派</li>
              </ul>
              <p className="text-lg text-gray-700">
                每铸造一块土地，推广者可获得10%的土地铸造费。
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                土地交易
              </h3>
              <p className="text-lg text-gray-700">
                可以选择上架自己的土地，设置价格等待别人购买，或者你可以对别人的土地进行出价购买。通过交易来赚取派币。
              </p>
              <p className="text-lg text-gray-700">
                交易手续费：每笔交易手续费是1%，卖家出手续费，买家不出手续费，每笔手续费中的10%返佣给上级邀请人。
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-[rgba(89,59,139,100)] mb-2">
                土地分红
              </h3>
              <p className="text-lg text-gray-700">
                二期土地开放后，每个城市所属的土地交易手续费和土地铸造费会有一部分成为该城市经济的收入来源，并将这些收益以DAO管理形式分发给该城市土地持有者。
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界积分板块：
              </h2>
              <p className="text-lg text-gray-700">
                Piday的平台积分为PidayPoint（派对积分），简称PP。获得方式：
              </p>
              <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
                <li>
                  自己每日签到获得，按日分配。初始值每日100个，按照平台总人数人数增加10倍减半机制。
                </li>
                <li>
                  邀请队友注册获得，按日按人分配，每邀请一人后，每日可额外获得20个，按照平台总人数人数增加10倍减半机制。
                </li>
                <li>
                  持有土地挖矿获得，按日按量分配，每持有一块土地，每日可额外获得300个，按照平台总人数人数增加10倍减半机制。
                </li>
              </ul>
              <p className="text-lg text-gray-700">
                每日只需签到一次，24小时为一日计算周期。
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对世界DAO板块（暂未上线）：
              </h2>
              <p className="text-lg text-gray-700">
                平台会有三种DAO结构，实现平台用户共建和共享。
              </p>
              <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
                <li>
                  自治城DAO。每个城市都是一个独立的DAO，由该城市土地持有者创建，用于管理该城市的经济发展和人文环境。自治城DAO收益来自于该城市土地铸造和土地交易。
                </li>
                <li>
                  联合国DAO。每个城市选派一名城市代表入驻联合国，用于联合所有自治城的去中心化集体治理和集体发展。联合国DAO收益来自于整个平台的土地铸造和土地交易。
                </li>
                <li>
                  派对DAO。主要是平台的运行、某些功能的实现、某些工具的提供等，保障派对元宇宙的正常运行。
                </li>
              </ul>
            </div>

            <div className="flex justify-center mb-10">
              <Image
                src="/img/about/map.png"
                alt="City"
                width={800}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对用户身份：
              </h2>
              <p className="text-lg text-gray-700">
                每个用户可以拥有多种身份，因为角色和持有土地情况而定。
              </p>
              <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
                <li>创世公民，创世土地持有者，人数上限为3万。</li>
                <li>数字公民，非创世土地持有者，人数上限为1.62万亿。</li>
                <li>数字游民，未持有土地的用户，人数没有上限。</li>
                <li>
                  南极居民，只持有南极土地的用户，南极土地初期免费获得，目前暂未开放。
                </li>
                <li>
                  数字代表，城市DAO领袖或联合国DAO人员，参与自治城管理或联合国管理。
                </li>
                <li>
                  数字守卫者，维护自己所在城市聊天室和谐的用户，相当于城市频道管理员。
                </li>
                <li>数字志愿者，元宇宙平台义务志愿者。</li>
                <li>派对管理员，派对平台的技术和运营人员，不断完善派对。</li>
              </ul>
              <p className="text-lg text-gray-700">
                各种身份的用户会获得对应土地或DAO的经济分红，数字志愿者会有额外的奖励（暂未公布）。
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-[rgba(89,59,139,100)] mb-4">
                派对官方社媒：
              </h2>
              <ul className="list-disc list-inside text-lg text-gray-700">
                <li>
                  <a
                    href="https://twitter.com/pidayapp"
                    className="text-blue-500 hover:underline"
                  >
                    推特
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/pidayapp"
                    className="text-blue-500 hover:underline"
                  >
                    电报
                  </a>
                </li>
                <li>
                  <a
                    href="https://piday.world"
                    className="text-blue-500 hover:underline"
                  >
                    官网
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
