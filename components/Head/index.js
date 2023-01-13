import useLocalStorageState from "use-local-storage-state";

export default function Head() {
  const [activeCurrency, setActiveCurrency] = useLocalStorageState(
    "activeCurrency",
    { defaultValue: "EUR" }
  );
  function handleActiveCurrency(event) {
    setActiveCurrency(event.target.value);
    window.location.reload();
  }
  return (
    <form>
      <select
        onChange={(event) => {
          handleActiveCurrency(event);
        }}
      >
        <option value={activeCurrency}>{activeCurrency}</option>
        {activeCurrency === "EUR" ? (
          <option value="USD">USD</option>
        ) : (
          <option value="EUR">EUR</option>
        )}
      </select>
    </form>
  );
}
