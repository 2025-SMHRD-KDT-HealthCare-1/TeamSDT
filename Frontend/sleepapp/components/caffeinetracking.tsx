import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import api from "../app/api/apiconfig";
import styles from "../styles/caffeinetrackingstyles";
import StarsBackground from "../components/starsbackground";

function convertLabel(original: string) {
  let label = original;
  label = label.replace(/^(커피_|스무디_커피_|스무디_)/, "");
  label = label.replace(/^카페\s*/, "");
  label = label.replace(/\s*\((Short|Tall|Grande|Venti)\)/, "");
  return label;
}

type CaffeineRecord = {
  id: string;
  brand: string;
  drink: string;
  size: string;
  caffeine: number;
  time: string;
};

function getNowTimeString() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function CaffeineTracking() {
  const [records, setRecords] = useState<CaffeineRecord[]>([]);
  const [brand, setBrand] = useState("");
  const [drink, setDrink] = useState("");
  const [size, setSize] = useState("");
  const [drinkTime, setDrinkTime] = useState(getNowTimeString());
  const [brandOpen, setBrandOpen] = useState(false);
  const [drinkOpen, setDrinkOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  const [brandList, setBrandList] = useState<string[]>([]);
  const [drinkList, setDrinkList] = useState<{ label: string; menu_key: string }[]>([]);
  const [sizeList, setSizeList] = useState<{ size: string; caffeine_mg: number }[]>([]);
  const [selectedMenuKey, setSelectedMenuKey] = useState("");

  useEffect(() => {
    api
      .get("/caffeine/brands")
      .then((res) => setBrandList(res.data.brands))
      .catch((err) => console.log("브랜드 불러오기 오류:", err));
  }, []);

  const loadMenus = (brand: string) => {
    api
      .get(`/caffeine/menus?brand=${brand}`)
      .then((res) => setDrinkList(res.data.menus))
      .catch((err) => console.log("메뉴 불러오기 오류:", err));
  };

  const loadSizes = (brand: string, menuKey: string) => {
    api
      .get(`/caffeine/sizes?brand=${brand}&menu_key=${menuKey}`)
      .then((res) => setSizeList(res.data.sizes))
      .catch((err) => console.log("사이즈 불러오기 오류:", err));
  };

  const getCaffeineAmount = () => {
    const found = sizeList.find((s) => s.size === size);
    return found ? found.caffeine_mg : 0;
  };

  const handleAddRecord = () => {
    if (!brand || !drink || !size || !drinkTime) {
      Alert.alert("알림", "모든 항목을 입력해주세요.");
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(drinkTime)) {
      Alert.alert("시간 형식 오류", "'HH:MM' 형식으로 입력해주세요.");
      return;
    }

    const newRecord: CaffeineRecord = {
      id: Date.now().toString(),
      brand,
      drink,
      size,
      caffeine: getCaffeineAmount(),
      time: drinkTime,
    };

    setRecords((prev) => [...prev, newRecord]);
    setBrand("");
    setDrink("");
    setSize("");
    setSelectedMenuKey("");
    setDrinkTime(getNowTimeString());
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const totalCaffeine = records.reduce((s, r) => s + r.caffeine, 0);

  return (
    <View style={styles.container}>
      
      <StarsBackground style={styles.starsContainer} />

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>☕</Text>
          <Text style={styles.cardTitle}>카페인 기록</Text>
        </View>

        {/* 브랜드 선택 */}
        <View style={styles.field}>
          <Text style={styles.label}>카페 브랜드 선택</Text>

          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              setBrandOpen(!brandOpen);
              setDrinkOpen(false);
              setSizeOpen(false);
            }}
          >
            <Text style={brand ? styles.selectText : styles.selectPlaceholder}>
              {brand || "브랜드를 선택하세요"}
            </Text>
            <Text style={styles.selectArrow}>▾</Text>
          </TouchableOpacity>

          {brandOpen && (
            <View style={styles.dropdown}>
              {brandList.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setBrand(b);
                    setDrink("");
                    setSize("");
                    setSelectedMenuKey("");
                    loadMenus(b);
                    setBrandOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘 마신 카페인 목록</Text>

        {records.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyText}>아직 기록이 없습니다</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {records.map((r) => (
              <View key={r.id} style={styles.recordRow}>
                <View style={styles.recordLeft}>
                  <Text style={styles.recordIcon}>☕</Text>
                  <View>
                    <Text style={styles.recordTitle}>
                      {r.brand} {convertLabel(r.drink)} ({r.size})
                    </Text>
                    <View style={styles.recordMetaRow}>
                      <Text style={styles.recordMetaText}>🕒 {r.time}</Text>
                      <Text style={styles.recordDot}>•</Text>
                      <Text style={styles.recordMetaText}>{r.caffeine} mg</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteRecord(r.id)}
                >
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.totalBoxWrapper}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>총 카페인</Text>
            <Text style={styles.totalValue}>{totalCaffeine} mg</Text>
          </View>
        </View>
      </View>

      <View style={styles.noticeWrapper}>
        <Text style={styles.noticeText}>
          ※ 카페인이 들어있지 않은 메뉴는 선택사항에 없습니다.
        </Text>
      </View>
    </View>
  );
}
