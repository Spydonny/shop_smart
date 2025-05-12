import React, { useState, useEffect, startTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchListById,
  addItem,
  updateItem,
  deleteItem,
  deleteList,
  generateItems,
} from "@/api"; // ваш файл с API-функциями
import { Flex, View, Button, Checkbox, TextField, Text, ActionButton } from "@adobe/react-spectrum";
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Share from "@spectrum-icons/workflow/Share";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArrowLeft from '@spectrum-icons/workflow/ArrowLeft';

export default function ListExpanded() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [prompt, setPrompt] = useState("");

  // Загрузка единожды
  useEffect(() => {
    if (!listId) return;
    fetchListById(listId).then(data => {
      if (data) setList(data);
      else navigate("/"); // если нет списка
    });
  }, [listId, navigate]);

  if (!list) {
    return <Text>Загрузка…</Text>;
  }

  const total = list.items.reduce((sum, i) => sum + (i.price || 0), 0);

  const optimisticUpdate = (updater) => {
    setList(prev => {
      const copy = { ...prev, items: [...prev.items] };
      updater(copy);
      return copy;
    });
  };

  const handleAdd = () => {
  const titleInput = window.prompt("Введите название и количество (например, Молоко 2):");
  if (!titleInput) return;

  const parts = titleInput.trim().split(" ");
  const quantity = parseInt(parts.pop(), 10);
  const title = parts.join(" ");

  if (!title || isNaN(quantity) || quantity < 1) {
    alert("Пожалуйста, введите название и корректное количество, например: Хлеб 3");
    return;
  }

  // Оптимистичное добавление
  const tempId = `temp-${Date.now()}`;
  optimisticUpdate(l =>
    l.items.push({ id: tempId, title: `${title} (${quantity})`, quantity, price: 0, is_bought: false })
  );
  addItem(listId, { title: `${title} (${quantity})`, quantity, price: 0, is_bought: false })
    .then(() => fetchListById(listId).then(fresh => setList(fresh)))
    .catch(err => {
      console.error(err);
      // уведомление/откат
    });
};

  const handleToggle = (item, isBought) => {
  setList(prev => {
    return {
      ...prev,
      items: prev.items.map(i =>
        i.id === item.id ? { ...i, is_bought: isBought } : i
      ),
    };
  });

  updateItem(listId, item.id, { title: item.title, quantity: item.quantity, is_bought: isBought })
    .catch(err => {
      console.error("Не удалось обновить покупку:", err);
    });
};

const handleGoHome = () => {
  navigate('/');
};

  const handleDeleteItemLocal = (item) => {
    optimisticUpdate(l => {
      l.items = l.items.filter(x => x.id !== item.id);
    });
    deleteItem(listId, item.id).catch(err => console.error(err));
  };

  const handleDeleteList = () => {
    if (!window.confirm(`Удалить список «${list.name}»?`)) return;
    deleteList(listId)
      .then(() => navigate("/"))
      .catch(err => console.error(err));
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    // оптимистично: можно показать индикатор загрузки или ничего не делать
    generateItems(listId, prompt)
      .then(() => fetchListById(listId).then(fresh => setList(fresh)))
      .catch(err => console.error(err));
    setPrompt("");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: list.name,
        text: `Мой список: ${list.name}`,
        url: window.location.href,
      });
    } else {
      window.prompt("Скопируйте ссылку:", window.location.href);
    }
  };

  return (
    <Flex width="100vw" height="100vh">
      <Flex width="10%" direction="column" padding="size-500">
        <ActionButton margin="size-100" maxWidth="size-1000"
         onPress={handleGoHome} aria-label="Домой">
          <ArrowLeft />
        </ActionButton>
      </Flex>

      <Flex width="80%" direction="column" alignItems="center" justifyContent="center">
        <Card width="100%">
          <CardHeader>
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <CardTitle>{list.name}</CardTitle>
              <Flex direction="row" gap="size-100">
                <Button onPress={handleAdd} aria-label="Добавить"><Add /></Button>
                <Button onPress={handleDeleteList} aria-label="Удалить"><Delete /></Button>
                <Button onPress={handleShare} aria-label="Поделиться"><Share /></Button>
              </Flex>
            </Flex>
          </CardHeader>

          <CardContent>
            <ScrollArea style={{ maxHeight: 400 }} className="overflow-auto rounded-md">
              <Flex direction="column" gap="size-100">
                {list.items.map(item => (
                  <Flex key={item.id} direction="row" alignItems="center" gap="size-200">
                    <Checkbox
                      isSelected={item.is_bought}
                      onChange={(isSelected) => handleToggle(item, isSelected)}
                    />
                    <Flex direction="row" alignItems="center" gap="size-100" flex>
                      <Text>{item.title}</Text>
                      <Text>{item.quantity}</Text>
                    </Flex>
                    <Button onPress={() => handleDeleteItemLocal(item)} aria-label="Удалить">
                      <Delete />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </ScrollArea>
            <View marginTop="size-200">
              <Text>Итого: {total.toFixed(2)}тг</Text>
            </View>
          </CardContent>

          <CardFooter>
            <Flex direction="row" alignItems="center" gap="size-200">
              <TextField
                placeholder="Генерировать элементы…"
                value={prompt}
                onChange={setPrompt}
                flex
              />
              <Button variant="cta" onPress={handleGenerate}>
                Генерировать
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Flex>

      <Flex width="10%" />
    </Flex>

  );
}

