using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

[System.Serializable]
public class HistoryEraData
{
    public string eraName;        // 예: 고조선 (BC 2333년)
    public string questionText;   // 퀴즈 문제
    public string leftOption;     // 왼쪽 단어
    public string rightOption;    // 오른쪽 단어
    public DirectionChoice answer;// 정답 방향
    public string blueprintName;  // 완성될 3D 설계도 이름
}

public class EraQuizManager : MonoBehaviour
{
    [Header("7대 역사 연도 데이터베이스")]
    public List<HistoryEraData> eraList = new List<HistoryEraData>();
    
    [Header("UI 연결")]
    public Text eraTitleText;
    public Text questionText;
    public Text leftButtonText;
    public Text rightButtonText;
    public Text scoreText;
    public GameObject victoryPanel;

    private int currentIndex = 0;
    private int collectedBlueprints = 0;
    private PlayerController player;
    private BlueprintAssembler blueprintAssembler;

    void Start()
    {
        player = FindObjectOfType<PlayerController>();
        blueprintAssembler = FindObjectOfType<BlueprintAssembler>();
        InitializeDefaultData();
        UpdateUI();
    }

    void InitializeDefaultData()
    {
        if (eraList.Count == 0)
        {
            eraList.Add(new HistoryEraData { eraName = "고조선 (BC 2333년)", questionText = "우리나라 최초의 국가를 세운 인물과 정신은?", leftOption = "단군왕검 / 홍익인간", rightOption = "세종대왕 / 훈민정음", answer = DirectionChoice.Left, blueprintName = "고인돌 3D 연구소" });
            eraList.Add(new HistoryEraData { eraName = "삼국시대 (BC 57년~)", questionText = "고구려, 백제, 신라 세 나라가 선의의 경쟁을 펼친 시대는?", leftOption = "조선시대", rightOption = "삼국시대", answer = DirectionChoice.Right, blueprintName = "첨성대 3D 관측소" });
            eraList.Add(new HistoryEraData { eraName = "고려시대 (918년)", questionText = "태조 왕건이 세웠으며, '코리아'의 이름이 전 세계에 알려진 시대는?", leftOption = "고려", rightOption = "대한민국", answer = DirectionChoice.Left, blueprintName = "만월대 3D 왕궁" });
            eraList.Add(new HistoryEraData { eraName = "조선시대 (1392년)", questionText = "이성계가 건국하고, 세종대왕이 한글(훈민정음)을 창제한 시대는?", leftOption = "대한제국", rightOption = "조선", answer = DirectionChoice.Right, blueprintName = "경복궁 3D 대청마루" });
            eraList.Add(new HistoryEraData { eraName = "대한제국 (1897년)", questionText = "고종 황제가 자주독립국임을 널리 선포한 국호는?", leftOption = "대한제국", rightOption = "고조선", answer = DirectionChoice.Left, blueprintName = "석조전 3D 포켓몬관" });
            eraList.Add(new HistoryEraData { eraName = "대한민국 (1948년)", questionText = "광복 이후 헌법을 제정하고 정식 정부가 수립된 현재 우리의 국가는?", leftOption = "삼국시대", rightOption = "대한민국", answer = DirectionChoice.Right, blueprintName = "국회의사당 3D 돔" });
            eraList.Add(new HistoryEraData { eraName = "6·25 전쟁 (1950년)", questionText = "한반도의 평화와 자유를 지켜낸 역사적 사건은?", leftOption = "6·25 평화 수호", rightOption = "임진왜란", answer = DirectionChoice.Left, blueprintName = "무궁화 평화 기념관" });
        }
    }

    public void CheckAnswer(DirectionChoice userChoice)
    {
        HistoryEraData currentEra = eraList[currentIndex];

        if (userChoice == currentEra.answer)
        {
            // 정답 처리 (무벌칙 + 즉각적 칭찬)
            collectedBlueprints++;
            scoreText.text = $"완성된 설계도: {collectedBlueprints} / {eraList.Count}";
            
            // 3D 설계도 조립 애니메이션 발동
            if (blueprintAssembler != null)
                blueprintAssembler.BuildPart(currentIndex);

            currentIndex++;

            if (currentIndex >= eraList.Count)
            {
                if (victoryPanel != null) victoryPanel.SetActive(true);
            }
            else
            {
                Invoke(nameof(NextQuestion), 1.2f);
            }
        }
        else
        {
            // 오답 시 페널티 없음 (귀여운 포켓몬 힌트 제공)
            Debug.Log("귀여운 포켓몬 친구: 아쉬워요! 시계 찬 왼쪽(또는 장갑 낀 오른쪽) 손으로 다시 도전해 봐요!");
            Invoke(nameof(ResetPlayer), 0.5f);
        }
    }

    void NextQuestion()
    {
        player.ResetPosition();
        UpdateUI();
    }

    void ResetPlayer()
    {
        player.ResetPosition();
    }

    void UpdateUI()
    {
        if (currentIndex < eraList.Count)
        {
            HistoryEraData q = eraList[currentIndex];
            eraTitleText.text = $"📜 {q.eraName}";
            questionText.text = q.questionText;
            leftButtonText.text = $"◀ 왼쪽 (시계): {q.leftOption}";
            rightButtonText.text = $"오른쪽 (장갑): {q.rightOption} ▶";
        }
    }
}
