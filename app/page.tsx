"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "./components/Header";
import { useRef, useState } from "react";
import { useFormStore } from "./state";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
export default function Home() {
  const {
    names,
    setNames,
    total,
    setTotal,
    paidBy,
    setPaidBy,
    items,
    setItems,
  } = useFormStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLInputElement>(null);
  const [editName, setEditName] = useState("");
  const [editCurrentItem, setEditCurrentItem] = useState(0);
  const [sharedBy, setSharedBy] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [serviceTax, setServiceTax] = useState<number>(10);
  const [gst, setGst] = useState<number>(9);

  const onNamesHandleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && event.currentTarget.value) {
      if (editName && event.currentTarget.value === "") {
        setNames(names.filter((name) => name !== editName));
        setEditName("");
      } else if (editName) {
        setNames(
          names.map((name) =>
            name === editName ? event.currentTarget.value : name
          )
        );
        setEditName("");
      } else {
        setNames([...names, event.currentTarget.value]);
      }
      event.currentTarget.value = "";
      setName("");
      setEditName("");
    }
  };

  const onChangeSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onClickAddNamesButton = () => {
    if (editName) {
      setNames(names.map((n) => (n === editName ? name : n)));
      setEditName("");
    } else {
      setNames([...names, name]);
    }
    setName("");
  };

  const handleEditName = (name: string) => {
    if (inputRef.current) {
      inputRef.current.focus();
      setName(name);
      setEditName(name);
    }
  };

  const handleRemoveName = () => {
    setNames(names.filter((name) => name !== editName));
    setEditName("");
    setName("");
  };

  const onItemsHandleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && sharedBy.length) {
      if (editCurrentItem !== 0) {
        setItems(
          items.map((item) =>
            item.price === editCurrentItem
              ? {
                  price: parseFloat(event.currentTarget.value),
                  sharedBy: [...sharedBy],
                }
              : item
          )
        );
        setEditCurrentItem(0);
      } else {
        setItems([
          ...items,
          {
            price: parseFloat(event.currentTarget.value),
            sharedBy: [...sharedBy],
          },
        ]);
      }
      if (itemRef.current) {
        itemRef.current?.select();
      }
      setRemaining(Math.round(total - (totalSum + currentItem)));
    }
  };

  const onChangeSetCurrentItem = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.value)
      setCurrentItem(parseFloat(event.currentTarget.value));
  };

  const onClickAddItemsButton = () => {
    if (currentItem) {
      if (editCurrentItem !== 0) {
        setItems(
          items.map((item) =>
            item.price === editCurrentItem
              ? {
                  price: currentItem,
                  sharedBy: [...sharedBy],
                }
              : item
          )
        );
        setEditCurrentItem(0);
      } else {
        setItems([
          ...items,
          {
            price: currentItem,
            sharedBy: [...sharedBy],
          },
        ]);
      }
      itemRef.current?.select();
      setRemaining(Math.round(total - (totalSum + currentItem)));
    }
  };

  const handleEditItem = (price: number) => {
    if (itemRef.current) {
      itemRef.current.focus();
      itemRef.current.select();
      setCurrentItem(price);
      setEditCurrentItem(price);
    }
  };

  const handleRemoveItem = () => {
    setItems(items.filter((item) => item.price !== editCurrentItem));
    setEditCurrentItem(0);
    setCurrentItem(0);
  };

  const onSelectPaidBy = (value: string) => {
    setPaidBy(value);
  };

  const onTotalOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(parseFloat(event.currentTarget.value));
    event.currentTarget.value = "";
  };

  const onTotalHandleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setTotal(parseFloat(event.currentTarget.value));
      event.currentTarget.value = "";
    }
  };

  const sumByPerson: { [key: string]: number } = {};
  let totalSum = 0;
  items.forEach((expense) => {
    const { price, sharedBy } = expense;
    const sharedPrice = (price / sharedBy.length).toFixed(2);
    totalSum += price;
    const postGSTSharedPrice = (
      (parseFloat(sharedPrice) + parseFloat(sharedPrice) * (serviceTax / 100)) *
      (1 + gst / 100)
    ).toFixed(2);
    sharedBy.forEach((person) => {
      sumByPerson[person] =
        (sumByPerson[person] || 0) + parseFloat(postGSTSharedPrice);
    });
  });

  const onChangeServiceTax = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceTax(parseInt(event.currentTarget.value));
  };

  const onChangeGst = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGst(parseInt(event.currentTarget.value));
  };

  return (
    <main className="flex flex-col gap-y-4 w-fit min-h-screen p-24 mx-auto content-center">
      <Header />
      <div className="grid w-full max-w-sm items-center gap-2.5">
        <div className="flex gap-x-2">
          <Input
            aria-label="Who's there? (min. 3 char)"
            type="text"
            id="Names"
            placeholder="Name"
            onKeyDown={onNamesHandleKeyDown}
            onChange={onChangeSetName}
            className="w-full"
            value={name}
            ref={inputRef}
          />
          <Button
            variant="outline"
            size="icon"
            className="self-end aspect-square"
            onClick={onClickAddNamesButton}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          {editName && (
            <Button
              variant="destructive"
              size="icon"
              className="self-end aspect-square"
              onClick={handleRemoveName}
            >
              <Cross1Icon className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-x-2">
          <Input
            aria-label="Total amount (aft. tax)"
            type="number"
            id="total"
            placeholder="e.g. 420.69"
            value={total}
            onChange={onTotalOnChange}
            onKeyDown={onTotalHandleKeyDown}
          />

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label>{`Paid by`}</Label>
            <Select onValueChange={onSelectPaidBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={"No one yet..."} />
              </SelectTrigger>
              <SelectContent>
                {names.map((name) => {
                  return (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="items-center">
          <div className="flex gap-x-2">
            {names.length > 0 && (
              <div className="self-start w-full max-w-[100px]">
                <Label>{`Shared by`}</Label>
                <ToggleGroup
                  type="multiple"
                  className="self-end gap-2 flex-wrap"
                  onValueChange={(value) => {
                    if (value) setSharedBy(value);
                  }}
                >
                  {names.map((n) => {
                    return (
                      <ToggleGroupItem
                        value={n}
                        aria-label={`Toggle ${n}`}
                        key={n}
                        className="w-fit aspect-square"
                      >
                        {n.split(" ").length > 1
                          ? n
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                          : n.substring(0, 3)}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>
            )}
            <div className="flex gap-x-2 items-center">
              <Input
                aria-label="What's on the bill? (bef. tax)"
                type="number"
                id="total"
                placeholder={
                  totalSum
                    ? Math.round(
                        total -
                          totalSum * (1 + serviceTax / 100) * (1 + gst / 100)
                      ).toString()
                    : "e.g. 420.69"
                }
                onKeyDown={onItemsHandleKeyDown}
                onChange={onChangeSetCurrentItem}
                value={currentItem}
                ref={itemRef}
              />
              <Button
                variant="outline"
                size="icon"
                className="aspect-square self-center mt-5"
                onClick={onClickAddItemsButton}
                disabled={!sharedBy.length}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
              {editCurrentItem !== 0 && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="aspect-square self-center mt-5"
                  onClick={handleRemoveItem}
                >
                  <Cross1Icon className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Need to change the taxes?</AccordionTrigger>
              <AccordionContent className="flex gap-x-2 mt-2">
                <Input
                  aria-label="Service tax (%)"
                  type="number"
                  id="serviceTax"
                  placeholder="e.g. 10"
                  onChange={onChangeServiceTax}
                  className="w-full"
                  value={serviceTax}
                />
                <Input
                  aria-label="GST (%)"
                  type="number"
                  id="gst"
                  placeholder="e.g. 9"
                  onChange={onChangeGst}
                  value={gst}
                  className="w-full"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {names.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-x-2">
                {names.map((n) => {
                  let variant:
                    | "default"
                    | "destructive"
                    | "outline"
                    | "secondary"
                    | null
                    | undefined = "default";
                  if (n === paidBy) variant = "destructive";
                  if (n === editName) variant = "outline";

                  return (
                    <Badge
                      className="w-[56px] cursor-pointer"
                      key={n}
                      variant={variant}
                      onClick={() => handleEditName(n)}
                    >
                      {n.split(" ").length > 1
                        ? n
                            .split(" ")
                            .map((word) => word.charAt(0))
                            .join("")
                        : n.substring(0, 3)}
                    </Badge>
                  );
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-1">
              {items.map(({ price, sharedBy }, index) => {
                const GSTTotal =
                  price * (1 + serviceTax / 100) * (1 + gst / 100) - price;
                const sharedPrice = (price / sharedBy.length).toFixed(2);

                const postGSTSharedPrice = (
                  (parseFloat(sharedPrice) +
                    parseFloat(sharedPrice) * (serviceTax / 100)) *
                  (1 + gst / 100)
                ).toFixed(2);
                return (
                  <div key={price} className="flex justify-between">
                    <div className="flex gap-x-2">
                      {names.map((n) => {
                        const match = sharedBy.includes(n);
                        return (
                          <Badge
                            key={`${n}-${price}-${index}`}
                            variant={match ? "outline" : "default"}
                            className={
                              !match
                                ? "w-[56px] text-transparent bg-transparent appearance-none border-none outline-none shadow-none hover:bg-transparent cursor-default"
                                : "w-[56px] cursor-pointer"
                            }
                            onClick={() => handleEditItem(i.price)}
                          >
                            {match ? postGSTSharedPrice : "-"}
                          </Badge>
                        );
                      })}
                    </div>
                    <div
                      className="pl-2 text-sm font-semibold items-center cursor-pointer flex gap-x-[2px]"
                      onClick={() => handleEditItem(price)}
                    >
                      {price.toFixed(2)}
                      <p className="border px-1 text-xs rounded-sm">{`${GSTTotal.toFixed(
                        2
                      )}`}</p>
                    </div>
                  </div>
                );
              })}
              {total > 0 && items.length > 0 && remaining !== 0 && (
                <Badge
                  variant={"secondary"}
                  className="w-fit self-end border rounded-ml px-1"
                >
                  {`${remaining}...`}
                </Badge>
              )}
            </CardContent>

            <CardFooter className="flex flex-col">
              <Separator className="my-2" />
              <div className="flex justify-between w-full gap-x-2">
                <div className="flex gap-x-2">
                  {names.map((key) => {
                    const match = Object.keys(sumByPerson).includes(key);
                    return (
                      <Badge
                        key={key}
                        className={
                          !match
                            ? "w-[56px] font-bold text-transparent bg-transparent appearance-none border-none outline-none shadow-none hover:bg-transparent cursor-default"
                            : "w-[56px] font-bold"
                        }
                        variant={"secondary"}
                      >
                        {match ? sumByPerson[key].toFixed(2) : "-"}
                      </Badge>
                    );
                  })}
                </div>
                <p
                  className={
                    Math.round(
                      totalSum * (1 + serviceTax / 100) * (1 + gst / 100) -
                        total
                    ) >= 0
                      ? "font-bold text-green-700"
                      : "font-bold text-yellow-600"
                  }
                >
                  {total.toFixed(2) || ""}
                </p>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
