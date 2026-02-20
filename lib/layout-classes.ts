export const containerClasses = `mx-auto w-full max-w-[2000px] overflow-hidden${
  process.env.NODE_ENV === "development" ? " border border-red-500" : ""
}`;

export const sectionClasses = `mx-auto w-full max-w-[1800px] overflow-hidden ${
  process.env.NODE_ENV === "development" ? " border border-blue-500" : ""
}`;

export const sectionInnerClasses =
  `flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 ${process.env.NODE_ENV === 'development' ? 'border border-green-500' : ''}`;
