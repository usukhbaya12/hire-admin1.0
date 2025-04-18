"use client";

import React from "react";
import { Badge, Button, Drawer, List, Typography } from "antd";
import { EyeBoldDuotone, RefreshCircleBoldDuotone } from "solar-icons";

const { Text } = Typography;

const ChangeTracker = ({
  visible,
  onClose,
  modifiedBlocks,
  modifiedQuestions,
  blocks,
  onResetChanges,
}) => {
  // Count modified items
  const blockCount = modifiedBlocks.size;
  const questionCount = modifiedQuestions.size;
  const totalChanges = blockCount + questionCount;

  // Map IDs to actual names for better readability
  const getBlockName = (blockId) => {
    const block = blocks.find((b) => b.id === blockId);
    return block ? block.name : `Block ID: ${blockId}`;
  };

  const getQuestionInfo = (questionId) => {
    for (const block of blocks) {
      const question = block.questions.find((q) => q.id === questionId);
      if (question) {
        // Extract text content from HTML without tags for cleaner display
        const questionText = question.question.name
          .replace(/<[^>]*>/g, "")
          .substring(0, 40);
        return {
          text: questionText || "No text",
          blockName: block.name,
        };
      }
    }
    return {
      text: `Question ID: ${questionId}`,
      blockName: "Unknown Block",
    };
  };

  return (
    <>
      {/* Floating badge to show number of pending changes */}
      {totalChanges > 0 && !visible && (
        <Badge
          count={totalChanges}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            cursor: "pointer",
            backgroundColor: "#f36421",
          }}
          onClick={onClose}
          overflowCount={99}
        >
          <Button
            className="the-btn"
            icon={<EyeBoldDuotone />}
            size="large"
            onClick={onClose}
          >
            Өөрчлөлтүүд
          </Button>
        </Badge>
      )}

      {/* Drawer to show details of changes */}
      <Drawer
        title={`Хадгалагдах өөрчлөлтүүд (${totalChanges})`}
        placement="right"
        onClose={onClose}
        open={visible}
        extra={
          <Button
            onClick={onResetChanges}
            icon={<RefreshCircleBoldDuotone />}
            className="back-btn"
            danger
          >
            Цэвэрлэх
          </Button>
        }
      >
        {totalChanges === 0 ? (
          <div className="text-center p-6 text-gray-500">
            Хадгалагдаагүй өөрчлөлт байхгүй байна
          </div>
        ) : (
          <>
            {blockCount > 0 && (
              <>
                <div className="font-bold mb-2">Блокууд ({blockCount})</div>
                <List
                  size="small"
                  bordered
                  dataSource={Array.from(modifiedBlocks)}
                  renderItem={(blockId) => (
                    <List.Item>
                      <Badge color="#f36421" />
                      <Text className="ml-2">{getBlockName(blockId)}</Text>
                    </List.Item>
                  )}
                  className="mb-4"
                />
              </>
            )}

            {questionCount > 0 && (
              <>
                <div className="font-bold mb-2">
                  Асуултууд ({questionCount})
                </div>
                <List
                  size="small"
                  bordered
                  dataSource={Array.from(modifiedQuestions)}
                  renderItem={(questionId) => {
                    const info = getQuestionInfo(questionId);
                    return (
                      <List.Item>
                        <Badge color="#3b82f6" />
                        <div className="ml-2">
                          <div>{info.text}</div>
                          <Text type="secondary" className="text-xs">
                            {info.blockName} блок доторх
                          </Text>
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </>
            )}
          </>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
          Зөвхөн дээрх өөрчлөгдсөн асуултууд болон блокуудыг л хадгалах болно.
          Энэ нь серверийн ачааллыг бууруулж, хадгалах үйл явцыг хурдасгана.
        </div>
      </Drawer>
    </>
  );
};

export default ChangeTracker;
