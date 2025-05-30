"use client"

import { useState,useContext,createContext,useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import PropTypes from 'prop-types';

export function ThemeProvider ({children,...props}){
    const[view,setView]=useState(false)
    useEffect(()=>{
        setView(true)
    },[])

    if(!view){
        return <>{children}</>
    }


    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

ThemeProvider.propTypes={
    children : PropTypes.node.isRequired,
    ...NextThemesProvider.propTypes
}


export const ThemeContext = createContext({
  theme: undefined,
  setTheme: () => null,
});



export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
