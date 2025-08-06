import pandas as pd
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionFindHospital(Action):
    def name(self) -> Text:
        return "action_find_hospital"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        print("👉 액션 실행됨")  # 액션 시작 로그

        location = tracker.get_slot("location")
        service = tracker.get_slot("service")
        price = tracker.get_slot("price")

        print(f"👉 슬롯 정보: location={location}, service={service}, price={price}")

        try:
            df = pd.read_csv("yoyang_facilities.csv")
            print("✅ CSV 파일 로딩 성공")
        except Exception as e:
            print(f"❌ CSV 로딩 실패: {e}")
            dispatcher.utter_message(text="CSV 파일을 불러오는 데 문제가 생겼습니다.")
            return []

        filtered_df = df.copy()
        print(f"🧾 원본 병원 수: {len(df)}")

        if location:
            filtered_df = filtered_df[filtered_df["지역"].str.contains(location, na=False)]
            print(f"📍 위치 필터링 후: {len(filtered_df)}")

        if service:
            filtered_df = filtered_df[filtered_df["제공서비스"].str.contains(service, na=False)]
            print(f"🧑‍⚕️ 서비스 필터링 후: {len(filtered_df)}")

        if price:
            try:
                max_price = int(price)
                filtered_df = filtered_df[filtered_df["1인실금액"] <= max_price]
                print(f"💰 가격 필터링 후: {len(filtered_df)}")
            except:
                print("⚠️ 가격 변환 실패")

        if filtered_df.empty:
            print("🚫 조건에 맞는 병원이 없음")
            dispatcher.utter_message(text="조건에 맞는 요양병원을 찾을 수 없습니다.")
        else:
            top = filtered_df.head(3)
            messages = [
                f"{i+1}. {row['기관명']} (주소: {row['주소']}, 전화번호: {row['전화번호']})"
                for i, (_, row) in enumerate(top.iterrows())
            ]
            print("✅ 추천 병원 출력됨")
            dispatcher.utter_message(text="추천 요양병원:\n" + "\n".join(messages))

        return []