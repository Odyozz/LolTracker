import React, { PropsWithChildren } from "react";
import "./Card.css";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`card ${className}`}>{children}</div>;
};
