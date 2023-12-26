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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Header from "./components/Header";
import { InputWithLabel } from "./components/InputWithLabel";
import { useState } from "react";
import { useFormStore } from "./state";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
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
  const [sharedBy, setSharedBy] = useState<string[]>([]);
  const [name, setName] = useState("");
  const onNamesHandleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setNames([...names, event.currentTarget.value]);
      event.currentTarget.value = "";
      setName("");
    }
  };
  const onChangeSetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };
  const onClickAddNamesButton = () => {
    setNames([...names, name]);
    setName("");
  };

  const onItemsHandleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      setItems([
        ...items,
        {
          price: parseFloat(event.currentTarget.value),
          sharedBy: [...sharedBy],
        },
      ]);
      event.currentTarget.value = "";
    }
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
      (parseFloat(sharedPrice) + parseFloat(sharedPrice) * 0.1) *
      1.08
    ).toFixed(2);
    sharedBy.forEach((person) => {
      sumByPerson[person] =
        (sumByPerson[person] || 0) + parseFloat(postGSTSharedPrice);
    });
  });

  return (
    <main className="flex flex-col gap-y-4 w-fit min-h-screen p-24 mx-auto content-center">
      <Header />
      <div className="grid w-full max-w-sm items-center gap-2.5">
        <div className="flex gap-x-2">
          <InputWithLabel
            aria-label="Who's there?"
            type="text"
            id="Names"
            placeholder="Name"
            onKeyDown={onNamesHandleKeyDown}
            onChange={onChangeSetName}
            className="w-full"
            value={name}
          />
          <Button
            variant="outline"
            size="icon"
            className="self-end w-12 aspect-square"
            onClick={onClickAddNamesButton}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-x-2">
          <InputWithLabel
            aria-label="Total amount"
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
            <InputWithLabel
              aria-label="What's on the bill?"
              type="number"
              id="total"
              placeholder={
                totalSum
                  ? Math.round(total - totalSum * 1.1 * 1.08).toString()
                  : "e.g. 420.69"
              }
              onKeyDown={onItemsHandleKeyDown}
            />

            {/* <Button
                variant="outline"
                size="icon"
                className="self-end w-12 aspect-square"
                onClick={handleOnClickItems}
              >
                <PlusIcon className="h-4 w-4" />
              </Button> */}
          </div>
        </div>
        {names.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-x-2">
                {names.map((n) => {
                  return (
                    <Badge
                      className="w-[56px]"
                      key={n}
                      variant={paidBy === n ? "destructive" : "default"}
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
              {items.map((i) => {
                const postGSTPrice = (i.price + i.price * 0.1) * 1.08;
                const sharedPrice = (i.price / i.sharedBy.length).toFixed(2);

                const postGSTSharedPrice = (
                  (parseFloat(sharedPrice) + parseFloat(sharedPrice) * 0.1) *
                  1.08
                ).toFixed(2);
                return (
                  <div key={i.price} className="flex justify-between">
                    <div className="flex gap-x-2">
                      {names.map((n) => {
                        const match = i.sharedBy.includes(n);
                        return (
                          <Badge
                            key={`${n}-${i.price}`}
                            variant={match ? "outline" : "default"}
                            className={
                              !match
                                ? "w-[56px] text-transparent bg-transparent appearance-none border-none outline-none shadow-none hover:bg-transparent cursor-default"
                                : "w-[56px]"
                            }
                          >
                            {match ? postGSTSharedPrice : "-"}
                          </Badge>
                        );
                      })}
                    </div>
                    <p className="pl-2 text-sm font-semibold items-center">
                      {postGSTPrice.toFixed(2)}
                    </p>
                  </div>
                );
              })}
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
                    Math.round(totalSum * 1.1 * 1.08 - total) >= 0
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
