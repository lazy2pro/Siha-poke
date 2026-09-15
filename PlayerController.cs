using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("이동 속도")]
    public float moveSpeed = 6.0f;
    
    [Header("포켓몬 팩맨 모델")]
    public Transform playerModel;
    
    private EraQuizManager quizManager;

    void Start()
    {
        quizManager = FindObjectOfType<EraQuizManager>();
    }

    void Update()
    {
        // 1. 왼쪽 이동 (A 키 / 왼쪽 화살표 / 시계 찬 손)
        if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow))
        {
            ChooseLeftDirection();
        }
        // 2. 오른쪽 이동 (D 키 / 오른쪽 화살표 / 장갑 낀 손)
        else if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow))
        {
            ChooseRightDirection();
        }
    }

    // UI 버튼 전용 (태블릿 터치 화면 대응)
    public void OnClickLeftButton()
    {
        ChooseLeftDirection();
    }

    public void OnClickRightButton()
    {
        ChooseRightDirection();
    }

    private void ChooseLeftDirection()
    {
        if (playerModel != null)
            playerModel.rotation = Quaternion.Euler(0, -90, 0); // 왼쪽 바라보기

        transform.position += Vector3.left * 2.0f;
        quizManager.CheckAnswer(DirectionChoice.Left);
    }

    private void ChooseRightDirection()
    {
        if (playerModel != null)
            playerModel.rotation = Quaternion.Euler(0, 90, 0); // 오른쪽 바라보기

        transform.position += Vector3.right * 2.0f;
        quizManager.CheckAnswer(DirectionChoice.Right);
    }

    public void ResetPosition()
    {
        transform.position = new Vector3(0, 0.5f, 0); // 중앙으로 안전하게 복귀
    }
}

public enum DirectionChoice { Left, Right }
