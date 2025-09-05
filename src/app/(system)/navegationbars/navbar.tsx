export const NavBar = () => {
  return (
    <div
      data-open={true}
      className="m-2 mx-1 flex h-16 w-[100%_-_80px] items-center gap-2 rounded-md bg-white px-3 shadow-sm data-[open=true]:w-[100%_-_288px]"
    >
      <div className="ml-[auto] flex w-fit items-center justify-center gap-2">
        <div className="hidden flex-col items-end gap-1 xl:flex"></div>
        <div className="flex h-[32px] w-[32px] items-center justify-center border-0 hover:bg-none">
          <div className="relative h-full w-full cursor-pointer overflow-hidden rounded-[50%] bg-[#9c9c9c]"></div>
        </div>
        <div className="flex h-[32px] w-[32px] items-center justify-center border-0 hover:bg-none">
          <div className="relative h-full w-full cursor-pointer overflow-hidden rounded-[50%] bg-[#9c9c9c]"></div>
        </div>
        <div className="flex h-[32px] w-[32px] items-center justify-center border-0 hover:bg-none">
          <div className="relative h-full w-full cursor-pointer overflow-hidden rounded-[50%] bg-[#9c9c9c]"></div>
        </div>
      </div>
    </div>
  );
};
