import useSWR from "swr";
import { useRouter } from "next/router";
import { StyledButton } from "../Button/Button.styled";
import { ProductCard } from "./Product.styled";
import Comments from "../Comments";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export default function Product() {
  const [activeCurrency, setActiveCurrency] = useLocalStorageState(
    "activeCurrency",
    { defaultValue: "EUR" }
  );
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR(id ? `/api/products/${id}` : null);

  if (!data) {
    return <h1>Loading...</h1>;
  }
  function handleDelete() {
    try {
      const response = fetch(`/api/products/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error(error);
    }
  }
  function handleEdit(event) {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
      const response = fetch(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
      });
      if (response.ok) {
        event.target.reset();
        router.push("/");
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  function handleToggleIsEditing() {
    setIsEditing(!isEditing);
  }
  return (
    <ProductCard>
      <h2>{data.name}</h2>
      {isEditing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleEdit(event);
            router.push("/");
          }}
        >
          <label htmlFor="product-input">
            <input
              type="text"
              id="product-input"
              name="name"
              defaultValue={data.name}
            />
          </label>
          <br></br>
          <label htmlFor="price-input">
            <input
              type="number"
              name="price"
              id="price-input"
              defaultValue={data.price}
            />
          </label>
          <br></br>
          <label htmlFor="currency-input">
            <select
              name="currency"
              id="currency-input"
              defaultValue={data.currency}
            >
              <option value="EUR">Euro</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <br></br>
          <label htmlFor="description-input">
            <input
              name="description"
              id="description-input"
              defaultValue={data.description}
              type="text"
            />
          </label>
          <br></br>
          <button type="submit">Save changes</button>
        </form>
      ) : (
        <>
          <p>Description: {data.description}</p>
          {activeCurrency === data.currency ? (
            <p>
              Price: {data.price} {data.currency}
            </p>
          ) : activeCurrency === "EUR" ? (
            <p>
              Price: {data.price / (1.08).toFixed(2)} {"EUR"}
            </p>
          ) : (
            <p>
              Price: {(data.price * 1.08).toFixed(2)} {"USD"}
            </p>
          )}
        </>
      )}

      {data.reviews.length > 0 && <Comments reviews={data.reviews} />}
      <StyledButton type="button" onClick={() => router.push("/")}>
        Back to all
      </StyledButton>
      <StyledButton
        type="button"
        onClick={() => {
          handleDelete();
          router.push("/");
        }}
      >
        Delete
      </StyledButton>
      <StyledButton
        onClick={() => {
          handleToggleIsEditing();
        }}
      >
        Edit
      </StyledButton>
    </ProductCard>
  );
}
