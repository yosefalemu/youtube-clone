// import HomeNavbar from "@/modules/home/ui/components/home-navbar";
// import { render, screen } from "@testing-library/react";

let data: number[] = [];
beforeAll(() => {
  console.log("Before all test cases");
  data = [1, 2, 3, 4, 5];
});
function sum(a: number, b: number) {
  return a + b;
}

function subtract(a: number, b: number) {
  return a - b;
}

test("adds 1 + 2 to equal 3", () => {
  console.log(data);
  expect(sum(2, 3)).toBe(5);
  expect(sum(1, 2)).toBe(3);
  expect(sum(2, 2)).not.toBe(5);
  expect(sum(1, 2)).not.toBe(4);
  expect(sum(1, 2)).not.toBe(5);
});

test("subtracts 2 - 1 to equal 1", () => {
  console.log(data);
  expect(subtract(2, 1)).toBe(1);
  expect(subtract(2, 1)).not.toBe(6);
});

type DataType = {
  label: string;
  value: number;
};
test("object-assignment", () => {
  const data: DataType[] = [
    { label: "A", value: 1 },
    { label: "B", value: 2 },
    { label: "C", value: 3 },
  ];
  const newData = data.map((d) => ({ ...d, value: d.value + 1 }));
  expect(newData).toEqual([
    { label: "A", value: 2 },
    { label: "B", value: 3 },
    { label: "C", value: 4 },
  ]);
});

type FetchDataResponse = {
  value: string;
};
async function fetchData(): Promise<FetchDataResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ value: "Hello World" });
    }, 2000);
  });
}

test("fetch-data", async () => {
  const data = await fetchData();
  expect(data.value).toEqual("Hello World");
  expect(data).not.toEqual({ value: "Hello" });
});

describe("combined-test-cases", () => {
  test("get-response", async () => {
    const data = await fetchData();
    expect(data).toMatchObject({ value: "Hello World" });
  });
  test("destract-object", async () => {
    const data = await fetchData();
    const { value } = data;
    expect(value).toEqual("Hello World");
  });
});

// describe("user-avatar", () => {
//   it("it should render user avatar", () => {
//     render(<HomeNavbar />);
//     const text = screen.getByText(/You tube/i);
//     expect(text).toBeInTheDocument();
//   });
// });
