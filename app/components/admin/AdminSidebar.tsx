"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillFileText } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { RiDashboardFill, RiShoppingBag3Fill } from "react-icons/ri";
import { IconType } from "react-icons";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [phoneActive, setPhoneActive] = useState(false);

  useEffect(() => {
    const resizeHandler = () => setPhoneActive(window.innerWidth < 1100);
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <>
      {phoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)}>
          <HiMenuAlt4 />
        </button>
      )}

      <aside
        style={
          phoneActive
            ? {
                width: "20rem",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: showModal ? "0" : "-20rem",
                transition: "all 0.5s",
              }
            : {}
        }
      >
        <h2>Shop Admin</h2>
        <MenuGroup
          heading="Dashboard"
          pathname={pathname}
          items={[
            {
              url: "/admin/dashboard",
              text: "Dashboard",
              Icon: RiDashboardFill,
            },
            {
              url: "/admin/product",
              text: "Product",
              Icon: RiShoppingBag3Fill,
            },
            // { url: "/admin/customers", text: "Customer", Icon: IoIosPeople },
            // { url: "/admin/transaction", text: "Transaction", Icon: AiFillFileText },
            { url: "/admin/orders", text: "Orders", Icon: AiFillFileText },
          ]}
        />
        {/* <MenuGroup
          heading="Charts"
          pathname={pathname}
          items={[
            { url: "/admin/chart/bar", text: "Bar", Icon: FaChartBar },
            { url: "/admin/chart/pie", text: "Pie", Icon: FaChartPie },
            { url: "/admin/chart/line", text: "Line", Icon: FaChartLine },
          ]}
        />
        <MenuGroup
          heading="Apps"
          pathname={pathname}
          items={[
            { url: "/admin/app/stopwatch", text: "Stopwatch", Icon: FaStopwatch },
            { url: "/admin/app/coupon", text: "Coupon", Icon: RiCoupon3Fill },
            { url: "/admin/app/toss", text: "Toss", Icon: FaGamepad },
          ]}
        /> */}

        {phoneActive && (
          <button id="close-sidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

type MenuItem = {
  url: string;
  text: string;
  Icon: IconType;
};

const MenuGroup = ({
  heading,
  items,
  pathname,
}: {
  heading: string;
  items: MenuItem[];
  pathname: string;
}) => (
  <div>
    <h5>{heading}</h5>
    <ul>
      {items.map((item) => (
        <Li key={item.url} {...item} pathname={pathname} />
      ))}
    </ul>
  </div>
);

const Li = ({ url, text, pathname, Icon }: MenuItem & { pathname: string }) => {
  const active = pathname === url || pathname.startsWith(`${url}/`);

  return (
    <li
      style={{
        backgroundColor: active ? "rgba(0,115,255,0.1)" : "white",
      }}
    >
      <Link
        href={url}
        style={{
          color: active ? "rgb(0,115,255)" : "black",
        }}
      >
        <Icon />
        {text}
      </Link>
    </li>
  );
};

export default AdminSidebar;
