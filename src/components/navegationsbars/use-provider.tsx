export const useNavigationProvider = () => {
  const [open, setOpen] = useSidebarStore(
    useShallow((state) => [state.open, state.setOpen]),
  );
};
