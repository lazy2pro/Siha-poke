using UnityEngine;

public class BlueprintAssembler : MonoBehaviour
{
    [Header("7대 연도별 3D 건물 모델 7개")]
    public GameObject[] building3DModels;

    public void BuildPart(int index)
    {
        if (index >= 0 && index < building3DModels.Length)
        {
            if (building3DModels[index] != null)
            {
                building3DModels[index].SetActive(true);
                // 위에서 쿵 하고 떨어지며 조립되는 연출 효과
                building3DModels[index].transform.position += Vector3.up * 3.0f;
            }
        }
    }
}
