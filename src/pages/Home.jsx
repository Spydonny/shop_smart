import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Flex,
  View,
  Heading,
  Text,
  Divider
} from '@adobe/react-spectrum';

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from '@/components/ui/card';
import { InputGroup } from '@/components/InputGroup';
import { useShoppingLists } from '@/hooks/useShoppingList'; 


export default function Home() {
  const [newListName, setNewListName] = useState('');
  const [existingListId, setExistingListId] = useState('');
  const navigate = useNavigate();

  const {
    lists,
    selectedList,
    handleCreateList,
    selectListById,
    loadLists,
  } = useShoppingLists();

  const handleCreate = useCallback(async () => {
    const trimmed = newListName.trim();
    if (!trimmed || lists.some((l) => l.name === trimmed)) return;

    await handleCreateList(trimmed);
    await loadLists(); 
    setNewListName(trimmed);
  }, [newListName, lists, handleCreateList]);

  const handleOpen = useCallback(async () => {
    const trimmed = existingListId.trim();
    if (!trimmed) return;

    selectListById(trimmed);
    await loadLists();
    setExistingListId(trimmed);
  }, [existingListId, selectListById]);

  return (
    <View width="100vw" height="100vh">
      <View backgroundColor="gray-100" padding="size-200">
        <Heading level={1} textAlign="center">Shop Smart</Heading>
      </View>

      <Flex direction="row" gap="size-200" height="calc(100% - 100px)" width="100%">
        {/* ▸ Sidebar */}
        <View
          flex={5}
          backgroundColor="white"
          borderRadius="medium"
          padding="size-200"
          UNSAFE_style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Heading level={2} marginBottom="size-200">Ваши списки</Heading>
          <Divider size="S" marginBottom="size-200" />

          {lists.length === 0 ? (
            <Text>У вас пока нет списков.</Text>
          ) : (
            <ScrollArea
              className="h-[71vh] overflow-auto rounded-md"
            >
              <Flex direction="column" gap="size-100">
                {lists.map((list) => (
                  <Card
                    key={list.id}
                    onPress={() => navigate(`/lists/${list.id}`)}
                    UNSAFE_style={{ cursor: 'pointer' }}
                  >
                    <View padding="size-200">
                      <Text>{list.name}</Text>
                    </View>
                  </Card>
                ))}
              </Flex>
            </ScrollArea>
          )}
        </View>

        <View
          flex={2}
          backgroundColor="white"
          borderRadius="medium"
          padding="size-150"
          UNSAFE_style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <Flex
            direction="column"
            height="100%"
            justifyContent="center"
            alignItems="center"
            gap="size-300"
          >
            <InputGroup
              label="Создать новый список"
              placeholder="Название списка"
              value={newListName}
              onChange={setNewListName}
              buttonLabel="Создать"
              onSubmit={handleCreate}
              variant="cta"
              disabled={!newListName.trim()}
            />

            <Divider size="M" />

            <InputGroup
              label="Открыть список по ID"
              placeholder="UUID списка"
              value={existingListId}
              onChange={setExistingListId}
              buttonLabel="Открыть"
              onSubmit={handleOpen}
              variant="secondary"
            />
          </Flex>
        </View>
      </Flex>
    </View>
  );
}

