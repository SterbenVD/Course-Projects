import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const usePathname = () => {
    return useLocation().pathname;
}