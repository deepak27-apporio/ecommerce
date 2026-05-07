"use client";

import { BiMaleFemale } from "react-icons/bi";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { last6Months, stats } from "@/app/lib/dummy-data";
import { BarChart, DoughnutChart } from "@/app/components/admin/Charts";
import { useFetch } from "@/app/hooks/useFetch";
import { getDashboardData } from "@/app/api/admin/dashboard";

const Dashboard = () => {
  const {data} = useFetch(()=>getDashboardData(),[])
  console.log("data",data)
  return (
      <main className="dashboard">
        {/* <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <img src={adminUser.photo} alt={adminUser.name} />
        </div> */}

        <section className="widget-container">
          <WidgetItem
            percent={stats.changePercent.revenue}
            amount
            value={data?.totalRevenue}
            heading="Revenue"
            color="rgb(0, 115, 255)"
          />
          <WidgetItem
            percent={stats.changePercent.user}
            value={data?.totalUser}
            color="rgb(0 198 202)"
            heading="Users"
          />
          <WidgetItem
            percent={stats.changePercent.order}
            value={data?.totalOrders}
            color="rgb(255 196 0)"
            heading="Total orders"
          />
          <WidgetItem
            percent={stats.changePercent.product}
            value={data?.totalProduct}
            color="rgb(76 0 255)"
            heading="Products"
          />
        </section>

        <section className="graph-container">
          {/* <div className="revenue-chart">
            <h2>Revenue & Transaction</h2>
            <BarChart
              labels={last6Months}
              data_1={stats.chart.revenue}
              data_2={stats.chart.order}
              title_1="Revenue"
              title_2="Transaction"
              bgColor_1="rgb(0, 115, 255)"
              bgColor_2="rgba(53, 162, 235, 0.8)"
            />
          </div> */}

          <div className="dashboard-categories">
            <h2>Inventory</h2>
            <div>
              {data?.categoryStock?.map((item) => {
                const heading = item?.category
                const value = item?.totalStock
                return (
                  <CategoryItem
                    key={heading}
                    value={value}
                    heading={heading}
                    color={`hsl(${value * 4}, ${value}%, 50%)`}
                  />
                );
              })}
            </div>
          </div>
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[data?.totalFemale, data?.totalMale]}
              backgroundColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]}
              cutout={80}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
        </section>

        {/* <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[data?.totalFemale, data?.totalMale]}
              backgroundColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]}
              cutout={80}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
        </section> */}
      </main>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `Rs ${value?.toLocaleString("en-IN")}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(${color} ${(Math.abs(percent) / 100) * 360}deg, rgb(255, 255, 255) 0)`,
      }}
    >
      <span style={{ color }}>{percent !== 0 && `${Math.min(Math.abs(percent), 9999)}%`}</span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div style={{ backgroundColor: color, width: `${value}%` }} />
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
